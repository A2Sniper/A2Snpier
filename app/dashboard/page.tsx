'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    {
      title: "Total Profit",
      value: "$12,847.50",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month"
    },
    {
      title: "Active Signals",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Activity,
      description: "currently running"
    },
    {
      title: "Win Rate",
      value: "78.4%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      description: "last 30 days"
    },
    {
      title: "Risk Score",
      value: "Medium",
      change: "Stable",
      trend: "neutral",
      icon: Shield,
      description: "portfolio health"
    }
  ];

  const recentSignals = [
    {
      pair: "EUR/USD",
      type: "BUY",
      entry: "1.0845",
      target: "1.0890",
      sl: "1.0820",
      status: "active",
      profit: "+45 pips",
      time: "2 hours ago"
    },
    {
      pair: "GBP/JPY",
      type: "SELL",
      entry: "185.20",
      target: "184.50",
      sl: "185.80",
      status: "closed",
      profit: "+70 pips",
      time: "4 hours ago"
    },
    {
      pair: "USD/CAD",
      type: "BUY",
      entry: "1.3520",
      target: "1.3580",
      sl: "1.3480",
      status: "pending",
      profit: "0 pips",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
              <p className="text-muted-foreground mt-1">Monitor your trading performance and signals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <Zap className="w-3 h-3 mr-1" />
                Live Trading
              </Badge>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {metric.trend === "up" && (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    )}
                    {metric.trend === "down" && (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={
                      metric.trend === "up" ? "text-green-600 dark:text-green-400" :
                      metric.trend === "down" ? "text-red-600 dark:text-red-400" :
                      "text-muted-foreground"
                    }>
                      {metric.change}
                    </span>
                    <span>{metric.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Signals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Trading Signals
            </CardTitle>
            <CardDescription>
              Latest forex signals and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSignals.map((signal, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground">{signal.pair}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{signal.time}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={signal.type === "BUY" ? "default" : "secondary"}
                      className={signal.type === "BUY" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"}
                    >
                      {signal.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry: </span>
                      <span className="font-medium text-foreground">{signal.entry}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium text-foreground">{signal.target}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SL: </span>
                      <span className="font-medium text-foreground">{signal.sl}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-semibold ${
                        signal.profit.includes('+') ? 'text-green-600 dark:text-green-400' : 
                        signal.profit.includes('-') ? 'text-red-600 dark:text-red-400' : 
                        'text-muted-foreground'
                      }`}>
                        {signal.profit}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          signal.status === "active" ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400" :
                          signal.status === "closed" ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400" :
                          "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
                        }
                      >
                        {signal.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}