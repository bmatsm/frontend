import { useEffect, useState, useRef, FormEvent } from "react"
import { FiTrash } from "react-icons/fi"
import { api } from "./services/api"

interface CustomersProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

export default function App() {

  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const [show, setShow] = useState<string>("all");

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const response = await api.get("/customers")
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })

    setCustomers(allCustomers => [...allCustomers, response.data]);

    nameRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        }
      })

      const response = await api.get("/customers")
      setCustomers(response.data);

    } catch (err) {
      console.log(err)
    }

  }

  function Cliente({ show, id, status, name, email }) {

    if (show === "all") {

      if (status) {
        return (
          <>

            <article key={id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">

              <p><span className="font-medium">Nome:</span> {name}</p>
              <p><span className="font-medium">E-mail:</span> {email}</p>
              <p className="bg-green-400"><span className="font-medium">Status:</span> {status ? "ATIVO" : "INATIVO"}</p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(id)}
              >
                <FiTrash size={18} color="#FFF" />
              </button>

            </article>

          </>
        );
      }
      else {
        return (
          <>

            <article key={id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">

              <p><span className="font-medium">Nome:</span> {name}</p>
              <p><span className="font-medium">E-mail:</span> {email}</p>
              <p className="bg-red-400"><span className="font-medium">Status:</span> {status ? "ATIVO" : "INATIVO"}</p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(id)}
              >
                <FiTrash size={18} color="#FFF" />
              </button>

            </article>

          </>
        );
      }

    }
    else if (show === "active") {
      if (status) {
        return (
          <>
            <article key={id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">

              <p><span className="font-medium">Nome:</span> {name}</p>
              <p><span className="font-medium">E-mail:</span> {email}</p>
              <p className="bg-green-400"><span className="font-medium">Status:</span> {status ? "ATIVO" : "INATIVO"}</p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(id)}
              >
                <FiTrash size={18} color="#FFF" />
              </button>

            </article>

          </>
        );
      }
    }
    else {
      if (!status) {
        return (
          <>
            <article key={id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">

              <p><span className="font-medium">Nome:</span> {name}</p>
              <p><span className="font-medium">E-mail:</span> {email}</p>
              <p className="bg-red-400"><span className="font-medium">Status:</span> {status ? "ATIVO" : "INATIVO"}</p>

              <button
                className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(id)}
              >
                <FiTrash size={18} color="#FFF" />
              </button>

            </article>
          </>
        );
      }
    }
  }

  function changeView(exibir: string) {
    setShow(exibir)
  }

  return (
    <div className="w-full min-h-screen bg-gray-800 flex justify-center px-4">

      <main className="my-10 w-full md:max-w-2xl">

        <h1 className="text-4xl font-medium text-white">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>

          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome completo..."
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">E-mail:</label>
          <input
            type="text"
            placeholder="Digite seu E-mail..."
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
          />

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"
          />
        </form>

        <section className="flex flex-col gap-4">

          <div className="flex mb-4">

            <button
              className="font-medium text-black bg-white w-1/3 rounded"
              onClick={() => changeView("all")}
            >
              <span>Exibir tudo</span>
            </button>

            <button
              className="font-medium text-black bg-green-500 w-1/3 rounded mx-2"
              onClick={() => changeView("active")}
            >
              <span>Exibir somente ativos</span>
            </button>

            <button
              className="font-medium text-black bg-red-500 w-1/3 rounded"
              onClick={() => changeView("inactive")}
            >
              <span>Exibir somente inativos</span>
            </button>

          </div>

          {customers.map((customer) => (
            <Cliente
              show={show}
              id={customer.id}
              status={customer.status}
              name={customer.name}
              email={customer.email}
            />
          ))}

        </section>

      </main>
    </div>
  )
}