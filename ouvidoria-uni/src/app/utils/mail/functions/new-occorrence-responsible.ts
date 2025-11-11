import prisma from "@/libs/prisma/prismaClient";
var nodemailer = require("nodemailer");

const SMTP = process.env.SMTP_HOST;
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASSWORD;

export const sendMailResponsible = async ({ id }: { id: string }) => {
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
    include: {
      category: {
        include: {
          User: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  console.log(occurrence);

  if (!occurrence) {
    return;
  }

  const logoLink = `
    <img class="img" src="https://faculdadefama.edu.br/wp-content/uploads/2021/09/logo-fama-estrela-colorida-verde.png"
    alt="Logo"  style="border:0; height: auto; max-width: 100%; display: flex; align-items: center;">
  `;

  const occurrenceReceived = `
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
                <h1 style="font-size: 24px; margin: 0;">Olá, Equipe de ${occurrence.category.name}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 20px;">
                <p style="font-size: 16px; line-height: 1.5;">Uma nova ocorrência foi registrada. Acesse a plataforma para dar continuidade ao atendimento.</p>
                <a href="https://ouvidoria.faculdadefama.edu.br" style="font-size: 16px; color: #007bff; text-decoration: underline;">Acesse aqui</a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px;">
                <p style="font-size: 14px; color: #888;">Esta é uma notificação automática. Por favor, não responda a este e-mail.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  for (const user of occurrence.category.User) {
    const userMail = user.email;

    transporter
      .sendMail({
        from: EMAIL,
        to: userMail,
        subject: "Novo Registro no Sistema",
        html: occurrenceReceived,
      })
      .then((info: any) => {
        console.log(info);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
};
