'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'

// Mock data
const subscriptionData = {
  plan: 'Pro Plan',
  price: 1499, // TRY
  status: 'PAST_DUE',
  currentPeriodStart: '2024-01-01',
  currentPeriodEnd: '2024-01-31',
  nextBillingDate: '2024-02-01'
}

const invoicesData = [
  {
    id: 'INV-001',
    month: '2024-01',
    amount: 1499,
    status: 'OVERDUE',
    dueDate: '2024-01-15',
    paidAt: null
  },
  {
    id: 'INV-002',
    month: '2023-12',
    amount: 1499,
    status: 'PAID',
    dueDate: '2023-12-15',
    paidAt: '2023-12-10'
  },
  {
    id: 'INV-003',
    month: '2023-11',
    amount: 1499,
    status: 'PAID',
    dueDate: '2023-11-15',
    paidAt: '2023-11-12'
  }
]

const expensesData = [
  {
    id: 'EXP-001',
    category: 'Yazılım',
    vendor: 'Adobe Creative Cloud',
    amount: 899,
    date: '2024-01-10',
    note: 'Aylık tasarım yazılımı aboneliği'
  },
  {
    id: 'EXP-002',
    category: 'Ofis',
    vendor: 'Kahve Dünyası',
    amount: 250,
    date: '2024-01-08',
    note: 'Ofis için kahve ve çay alımı'
  },
  {
    id: 'EXP-003',
    category: 'Pazarlama',
    vendor: 'Google Ads',
    amount: 2500,
    date: '2024-01-05',
    note: 'Dijital pazarlama kampanyası'
  }
]

const salariesData = [
  {
    id: 'SAL-001',
    employeeName: 'Ahmet Yılmaz',
    amount: 15000,
    period: '2024-01',
    status: 'PAID'
  },
  {
    id: 'SAL-002',
    employeeName: 'Elif Kaya',
    amount: 14000,
    period: '2024-01',
    status: 'PAID'
  },
  {
    id: 'SAL-003',
    employeeName: 'Mehmet Can',
    amount: 12000,
    period: '2024-01',
    status: 'PENDING'
  }
]

const monthlyData = {
  revenue: 1499,
  outstanding: 1499,
  expenses: 3649,
  salaries: 41000,
  netProfit: -43150
}

export default function AccountingPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const t = useTranslations()

  const [activeTab, setActiveTab] = useState('overview')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'OVERDUE':
      case 'PAST_DUE':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, className: string }> = {
      'PAID': { variant: 'default', className: 'bg-green-100 text-green-800' },
      'PENDING': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
      'OVERDUE': { variant: 'destructive', className: 'bg-red-100 text-red-800' },
      'PAST_DUE': { variant: 'destructive', className: 'bg-red-100 text-red-800' },
      'CANCELLED': { variant: 'outline', className: 'bg-gray-100 text-gray-800' }
    }

    const config = variants[status] || variants['PENDING']

    return (
      <Badge className={config.className}>
        {t(`accounting.${status.toLowerCase()}`)}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card header-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">{t('nav.accounting')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('accounting.description')}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapor İndir
            </Button>

            <Button className="bg-brand-primary text-black hover:bg-brand-accent">
              <Plus className="w-4 h-4 mr-2" />
              Gider Ekle
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Subscription Status Alert */}
          {subscriptionData.status === 'PAST_DUE' && (
            <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <h3 className="font-medium text-red-800 dark:text-red-200">
                        Ödeme Gerekli
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Aboneliğinizin ödemesi gecikmiştir. Hizmetlerin kesintiye uğramaması için lütfen ödemenizi yapın.
                      </p>
                    </div>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('accounting.payNow')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="subscription">{t('accounting.subscription')}</TabsTrigger>
              <TabsTrigger value="invoices">{t('accounting.invoices')}</TabsTrigger>
              <TabsTrigger value="expenses">{t('accounting.expenses')}</TabsTrigger>
              <TabsTrigger value="reports">{t('accounting.reports')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      {t('accounting.revenue')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(monthlyData.revenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">Bu ay</p>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                      {t('accounting.outstanding')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(monthlyData.outstanding)}
                    </div>
                    <p className="text-xs text-muted-foreground">Bekleyen ödemeler</p>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                      {t('accounting.totalExpenses')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(monthlyData.expenses + monthlyData.salaries)}
                    </div>
                    <p className="text-xs text-muted-foreground">Bu ay toplam</p>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Receipt className="w-4 h-4 mr-2 text-blue-500" />
                      {t('accounting.netProfit')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${monthlyData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyData.netProfit)}
                    </div>
                    <p className="text-xs text-muted-foreground">Bu ay</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Son Faturalar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {invoicesData.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(invoice.status)}
                            <div>
                              <p className="font-medium">{invoice.id}</p>
                              <p className="text-sm text-muted-foreground">{invoice.month}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                            {getStatusBadge(invoice.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Son Giderler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expensesData.slice(0, 3).map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{expense.vendor}</p>
                            <p className="text-sm text-muted-foreground">{expense.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(expense.amount)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t('accounting.subscription')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="font-semibold text-lg">{subscriptionData.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aylık Ücret</p>
                      <p className="font-semibold text-lg">{formatCurrency(subscriptionData.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Durum</p>
                      {getStatusBadge(subscriptionData.status)}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Faturalama Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mevcut Dönem</p>
                        <p>{new Date(subscriptionData.currentPeriodStart).toLocaleDateString('tr-TR')} - {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sonraki Fatura</p>
                        <p>{new Date(subscriptionData.nextBillingDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Ödeme Yöntemi</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">iyzico</span>
                      </div>
                      <div>
                        <p className="font-medium">**** **** **** 1234</p>
                        <p className="text-sm text-muted-foreground">Visa • 12/25</p>
                      </div>
                    </div>
                  </div>

                  {subscriptionData.status === 'PAST_DUE' && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                        Ödeme Gerekli
                      </p>
                      <p className="text-red-600 dark:text-red-300 text-sm mb-4">
                        Aboneliğinizin ödemesi {formatCurrency(subscriptionData.price)} tutarında gecikmiştir.
                      </p>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        İyzico ile Öde
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>{t('accounting.invoices')}</CardTitle>
                  <CardDescription>
                    Aylık abonelik faturalarınızı görüntüleyin ve indirin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoicesData.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(invoice.status)}
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(invoice.month + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                            <p className="text-sm text-muted-foreground">
                              Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          {getStatusBadge(invoice.status)}
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            İndir
                          </Button>
                          {invoice.status === 'OVERDUE' && (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              Öde
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>{t('accounting.expenses')}</CardTitle>
                  <CardDescription>
                    Şirket giderlerinizi takip edin ve yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expensesData.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{expense.vendor}</p>
                          <p className="text-sm text-muted-foreground">{expense.category}</p>
                          {expense.note && (
                            <p className="text-xs text-muted-foreground mt-1">{expense.note}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(expense.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Salary Summary */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {t('accounting.salaries')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salariesData.map((salary) => (
                      <div key={salary.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{salary.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(salary.period + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <p className="font-medium">{formatCurrency(salary.amount)}</p>
                          {getStatusBadge(salary.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Aylık Finansal Rapor
                  </CardTitle>
                  <CardDescription>
                    Ocak 2024 finansal özeti
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Gelirler</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Abonelik Gelirleri</span>
                          <span className="font-medium text-green-600">{formatCurrency(monthlyData.revenue)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Toplam Gelir</span>
                          <span className="font-medium text-green-600">{formatCurrency(monthlyData.revenue)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Giderler</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Operasyonel Giderler</span>
                          <span className="font-medium text-red-600">{formatCurrency(monthlyData.expenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Maaşlar</span>
                          <span className="font-medium text-red-600">{formatCurrency(monthlyData.salaries)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Toplam Gider</span>
                          <span className="font-medium text-red-600">{formatCurrency(monthlyData.expenses + monthlyData.salaries)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Net Kar/Zarar</h3>
                      <span className={`text-xl font-bold ${monthlyData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(monthlyData.netProfit)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
