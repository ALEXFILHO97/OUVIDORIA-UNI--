"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  quantity: Array<{ date: string; count: number }>;
  byCategory: Array<{ category: string; count: number }>;
  resolutionDuration: Array<{
    id: string;
    category: string;
    duration: number;
    created_at: string;
    finished_in: string;
  }>;
}

interface DashboardProps {
  initialData?: DashboardData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Dashboard({ initialData }: DashboardProps) {
  const [data, setData] = useState<DashboardData>(
    initialData || {
      quantity: [],
      byCategory: [],
      resolutionDuration: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.from) {
        params.append("startDate", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        params.append("endDate", dateRange.to.toISOString());
      }

      console.log("Buscando dados com parâmetros:", params.toString());

      const [quantityRes, categoryRes, durationRes] = await Promise.all([
        fetch(`/api/reports?type=quantity&${params}`),
        fetch(`/api/reports?type=byCategory&${params}`),
        fetch(`/api/reports?type=resolutionDuration&${params}`),
      ]);

      const [quantityData, categoryData, durationData] = await Promise.all([
        quantityRes.json(),
        categoryRes.json(),
        durationRes.json(),
      ]);

      console.log("Dados recebidos:", { quantityData, categoryData, durationData });

      setData({
        quantity: quantityData.data || [],
        byCategory: categoryData.data || [],
        resolutionDuration: durationData.data || [],
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const setCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setDateRange({ from: firstDay, to: lastDay });
  };

  const setCurrentDay = () => {
    const today = new Date();
    setDateRange({ from: today, to: today });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Período:</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setDateRange(prev => ({ ...prev, from: date }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">até</span>
                <input
                  type="date"
                  value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setDateRange(prev => ({ ...prev, to: date }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button onClick={setCurrentDay} variant="outline" size="sm">
              Dia Atual
            </Button>
            <Button onClick={setCurrentMonth} variant="outline" size="sm">
              Mês Atual
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
            <Button onClick={fetchData} variant="default" size="sm">
              Atualizar
            </Button>
            <Button 
              onClick={() => {
                setDateRange({ from: undefined, to: undefined });
                fetchData();
              }} 
              variant="secondary" 
              size="sm"
            >
              Ver Todos os Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Dados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Chamados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.quantity.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categorias Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.byCategory.length}</div>
            <p className="text-xs text-muted-foreground">
              Categorias com chamados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo Médio de Resolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.resolutionDuration.length > 0
                ? Math.round(
                    data.resolutionDuration.reduce(
                      (sum, item) => sum + item.duration,
                      0
                    ) / data.resolutionDuration.length
                  )
                : 0}
              h
            </div>
            <p className="text-xs text-muted-foreground">
              Horas em média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Diária */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Diária</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="h-64">
                {data.quantity.length > 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.quantity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => format(new Date(value), "dd/MM", { locale: ptBR })}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy", { locale: ptBR })}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#0088FE" 
                          strokeWidth={2}
                          dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    Nenhum dado encontrado para o período selecionado
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chamados por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="h-64">
                {data.byCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, count }) => `${category}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">
                    Nenhum dado encontrado para o período selecionado
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Top Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categorias por Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="h-64">
              {data.byCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">
                  Nenhum dado encontrado para o período selecionado
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duração da Resolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Duração da Resolução por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="h-64">
                {data.resolutionDuration.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.resolutionDuration}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}h`, 'Duração']}
                      />
                      <Bar dataKey="duration" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">
                    Nenhum chamado finalizado encontrado para o período selecionado
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes das Resoluções</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.resolutionDuration.length > 0 ? (
                  data.resolutionDuration.slice(0, 10).map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {item.category}
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {item.duration}h
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })} → {format(new Date(item.finished_in), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Nenhum chamado finalizado encontrado para o período selecionado
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
