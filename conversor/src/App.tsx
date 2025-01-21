import { useEffect, useState } from "react";
import axios from "axios";

interface RespostaTaxas {
  base_code: string;
  conversion_rates: Record<string, number>;
}

function App() {
  const [dados, setDados] = useState<RespostaTaxas | null>(null);
  const [moedaOrigem, setMoedaOrigem] = useState("USD");
  const [moedaDestino, setMoedaDestino] = useState("BRL");
  const [valor, setValor] = useState(1);
  const [resultado, setResultado] = useState(0);

  useEffect(() => {
    axios
      .get<RespostaTaxas>(
        "https://v6.exchangerate-api.com/v6/d7237178d2c56b528bb3dcf4/latest/USD"
      )
      .then((resposta) => setDados(resposta.data))
      .catch((erro) => console.error("Erro ao buscar os dados:", erro));
  }, []);

  const converterMoeda = () => {
    if (dados) {
      const taxaOrigem = dados.conversion_rates[moedaOrigem];
      const taxaDestino = dados.conversion_rates[moedaDestino];
      setResultado((valor / taxaOrigem) * taxaDestino);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center">
      
      <header className="w-full bg-black text-white py-4 h-24 items-center flex justify-center shadow-lg fixed top-0 z-50">
        <h1 className="text-center text-3xl lg:text-4xl font-bold">Conversor de Moedas</h1>
      </header>

      
      <main className="mt-32 flex flex-col items-center gap-12 px-4 w-full  max-w-4xl">
        
        <section className="w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
            Taxas de Câmbio
          </h2>
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {dados &&
              Object.entries(dados.conversion_rates)
                .slice(0, 100)
                .map(([moeda, taxa]) => (
                  <div
                    key={moeda}
                    className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 px-6 py-4 rounded-lg shadow-sm text-center flex-shrink-0"
                  >
                    <p className="font-bold">{moeda}</p>
                    <p>{taxa.toFixed(2)}</p>
                  </div>
                ))}
          </div>
        </section>

        
        <section className="w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
            Converter Moeda
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda Origem:
                </span>
                <select
                  value={moedaOrigem}
                  onChange={(e) => setMoedaOrigem(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                >
                  {dados &&
                    Object.keys(dados.conversion_rates).map((moeda) => (
                      <option key={moeda} value={moeda}>
                        {moeda}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda Destino:
                </span>
                <select
                  value={moedaDestino}
                  onChange={(e) => setMoedaDestino(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                >
                  {dados &&
                    Object.keys(dados.conversion_rates).map((moeda) => (
                      <option key={moeda} value={moeda}>
                        {moeda}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <label>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Valor:
              </span>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 bg-gray-50"
              />
            </label>

            <button
              onClick={converterMoeda}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Converter
            </button>

            {resultado > 0 && (
              <div className="mt-4 text-center text-lg font-semibold text-blue-700">
                {valor} {moedaOrigem} = {resultado.toFixed(2)} {moedaDestino}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="w-full text-center py-4 text-gray-600 ">
        Desenvolvido por <strong>André Lucas</strong>
      </footer>
    </div>
  );
}

export default App;
