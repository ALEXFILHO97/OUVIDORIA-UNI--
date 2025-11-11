import prisma from "@/libs/prisma/prismaClient";

var nodemailer = require("nodemailer");

const SMTP = process.env.SMTP_HOST;
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASSWORD;

export const sendMailNew = async ({
  email,
  id,
}: {
  email: string;
  id: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: SMTP,
    port: 587,
    secure: false,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const student = await prisma.student.findUnique({
    where: { email },
  });

  if (!student) {
    return;
  }

  const occurrence = await prisma.occurrence.findUnique({
    where: { id },
  });

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
                  <h1 style="font-size: 24px; margin: 0;">Olá, ${student.name}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 20px;">
                  <p style="font-size: 16px; line-height: 1.5;">Recebemos sua solicitação e encaminhamos para o setor responsável. Estamos dando continuidade na tratativa e qualquer atualização será enviada para este email. Por favor, não responda a este email.</p>
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
      to: email,
      subject: "Recebemos sua solicitação",
      html: occurrenceReceived,
    })
    .then((info: any) => {
      console.log(info);
    })
    .catch((error: any) => {
      console.log(error);
    });
};
