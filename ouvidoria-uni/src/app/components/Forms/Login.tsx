"use client"; 
// Habilita o componente como client-side no Next.js 13+

import { signIn } from "next-auth/react"; // Função para autenticação com NextAuth
import { useRouter } from "next/navigation"; // Hook para redirecionar rotas
import { useForm } from "react-hook-form"; // Biblioteca para manipular formulários

// Tipagem dos valores que o formulário vai receber
type Values = {
  email: string;
  password: string;
};

export default function LoginAdmin() {
  // Hook do react-hook-form para registrar inputs, validar e lidar com erros
  const {
    register, // registra os campos no formulário
    handleSubmit, // executa função quando o form é submetido
    setError, // seta erros manualmente
    formState: { errors }, // contém os erros atuais do formulário
  } = useForm<Values>({ defaultValues: { email: "", password: "" } });

  const router = useRouter(); // Hook para navegação

  // Função que será chamada quando o usuário clicar em "Entrar"
  const handleLogin = async (data: Values) => {
    // Faz a tentativa de login com o provider "credentials"
    const resp = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // evita redirecionamento automático
      callbackUrl: "/admin", // página padrão após login
    });

    // Se der erro inesperado
    if (resp == null)
      throw new Error("Unexpected error: signIn returned undefined");

    // Se login deu certo, redireciona para a URL retornada
    if (resp.ok) {
      resp.url && router.push(resp.url);
    }

    // Caso resposta seja undefined (falha inesperada)
    if (resp === undefined) {
      setError("root", { message: "ocorreu um erro inesperado" });
    }

    // Trata erros específicos retornados pelo backend
    switch (resp.error) {
      case "Invalid password":
        setError("password", { message: "Senha incorreta" });
        break;
      case "Invalid email":
        setError("email", { message: "E-mail não cadastrado" });
        break;
    }
  };

  return (
    // Formulário que dispara a função handleLogin no submit
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="px-5 py-7">
        
        {/* Campo de E-mail */}
        <label className="block mb-5">
          <div className="font-semibold text-sm text-gray-600 pb-1 ">
            E-mail
          </div>
          <input
            id="email"
            {...register("email", { required: "obrigatório" })} // validação obrigatória
            type="text"
            className={[
              "border rounded-lg px-3 py-2 mt-1 text-sm w-full",
              errors.email ? "border-red-500" : "", // borda vermelha se erro
            ].join(" ")}
          />
          {/* Mensagem de erro para e-mail */}
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </label>

        {/* Campo de Senha */}
        <label className="block mb-5">
          <div className="font-semibold text-sm text-gray-600 pb-1 ">
            Senha
          </div>
          <input
            id="password"
            {...register("password", { required: "obrigatório" })} // validação obrigatória
            type="password"
            className={[
              "border rounded-lg px-3 py-2 mt-1 text-sm w-full",
              errors.password ? "border-red-500" : "", // borda vermelha se erro
            ].join(" ")}
          />
          {/* Mensagem de erro para senha */}
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
          {/* Mensagem de erro genérica (root) */}
          {errors.root && (
            <small className="text-red-500">{errors.root.message}</small>
          )}
        </label>

        {/* Botão de Login */}
        <button
          type="submit"
          className="transition duration-200 bg-green-500 hover:bg-green-600 
          focus:bg-green-600 focus:shadow-sm focus:ring-4 focus:ring-green-600 
          focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-lg 
          shadow-sm hover:shadow-md font-semibold text-center inline-block"
        >
          <span className="inline-block mr-2">Entrar</span>
        </button>
      </div>
    </form>
  );
}
