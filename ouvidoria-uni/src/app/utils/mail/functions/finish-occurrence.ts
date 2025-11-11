import prisma from "@/libs/prisma/prismaClient";

var nodemailer = require("nodemailer");

const SMTP = process.env.SMTP_HOST;
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASSWORD;

export const sendMailFinish = async ({ id }: { id: string }) => {
  const transporter = nodemailer.createTransport({
    host: SMTP,
    port: 587,
    secure: false,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const occurrence = await prisma.occurrence.findUnique({
    where: { id },

    include: { student: true },
  });

  if (!occurrence) {
    return;
  }

  const logoLink = `
  <img class="img" src="https://faculdadefama.edu.br/wp-content/uploads/2021/09/logo-fama-estrela-colorida-verde.png"
  alt="Logo"  style="border:0; height: auto; max-width: 100%; display: flex; align-items: center;">
  `;

  const finish = `
    <table cellpadding="0" cellspacing="0" width="100%" align="center" bgcolor="#f5f5f5">
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0" align="center" width="600" style="border-collapse: collapse; background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                ${logoLink}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px;">
                <h1 style="font-size: 24px; margin: 0;">Solicitação Finalizada</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 20px;">
                <p style="font-size: 16px; line-height: 1.5;">Olá, ${occurrence.student?.name}!</p>
                <p style="font-size: 16px; line-height: 1.5;">A solicitação:</p>
                <h2 style="font-size: 20px; margin: 10px 0; color: #007bff;">[Título da Solicitação]</h2>
                <p style="font-size: 16px; line-height: 1.5;">Foi finalizada! Agradecemos por utilizar nosso sistema de Ouvidoria. Você pode acessar para ver todos os detalhes.</p>
                <p style="font-size: 16px; line-height: 1.5;">Lembramos que estamos sempre à disposição para qualquer outra solicitação futura.</p>
                <p style="font-size: 16px; line-height: 1.5;">Acesse o sistema através do link abaixo:</p>
                <a href="https://ouvidoria.faculdadefama.edu.br" style="font-size: 16px; color: #007bff; text-decoration: underline;">Acessar agora</a>
                <p style="font-size: 16px; line-height: 1.5;">Lembre-se de informar o seu email para acessar e avaliar.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px;">
                <p style="font-size: 14px; color: #888;">Este é um email automático. Por favor, não o responda.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  transporter
    .sendMail({
      from: EMAIL,
      to: occurrence.student?.name,
      subject: "Solicitação Finalizada",
      html: finish,
    })
    .then((info: any) => {
      console.log(info);
    })
    .catch((error: any) => {
      console.log(error);
    });
};
