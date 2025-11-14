"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface SimpleDashboardProps {
  initialData?: DashboardData;
}

export default function SimpleDashboard({ initialData }: SimpleDashboardProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Gráficos Simples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Diária - Gráfico de Barras Simples */}
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
                  <div className="flex items-end justify-between h-full space-x-2">
                    {data.quantity.slice(0, 10).map((item, index) => {
                      const maxCount = Math.max(...data.quantity.map(d => d.count));
                      const height = (item.count / maxCount) * 200;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-blue-500 w-full rounded-t"
                            style={{ height: `${height}px` }}
                            title={`${format(new Date(item.date), "dd/MM", { locale: ptBR })}: ${item.count} chamados`}
                          ></div>
                          <div className="text-xs mt-2 text-center">
                            {format(new Date(item.date), "dd/MM", { locale: ptBR })}
                          </div>
                          <div className="text-xs font-medium">
                            {item.count}
                          </div>
                        </div>
                      );
                    })}
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

        {/* Chamados por Categoria - Gráfico de Pizza Simples */}
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
                  <div className="space-y-3">
                    {data.byCategory.map((item, index) => {
                      const total = data.byCategory.reduce((sum, cat) => sum + cat.count, 0);
                      const percentage = (item.count / total) * 100;
                      const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          ></div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.category}</span>
                              <span>{item.count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: colors[index % colors.length]
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
      </div>

      {/* Duração da Resolução */}
      <Card>
        <CardHeader>
          <CardTitle>Duração da Resolução dos Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {data.resolutionDuration.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.resolutionDuration.slice(0, 12).map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="text-sm text-gray-600">
                        {item.category}
                      </div>
                      <div className="text-lg font-semibold">
                        {item.duration}h
                      </div>
                      <div className="text-xs text-gray-500">
                        Criado: {format(new Date(item.created_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Finalizado: {format(new Date(item.finished_in), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
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
  );
}
