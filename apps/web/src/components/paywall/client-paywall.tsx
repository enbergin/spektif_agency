'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  AlertTriangle,
  Mail,
  Lock,
  Timer
} from 'lucide-react'

interface ClientPaywallProps {
  organizationName: string
  overdueAmount?: number
  dueDate?: string
  contactEmail?: string
  onContactAdmin?: () => void
  onPayment?: () => void
}

export function ClientPaywall({
  organizationName,
  overdueAmount = 1499,
  dueDate,
  contactEmail = 'admin@spektif.com',
  onContactAdmin,
  onPayment
}: ClientPaywallProps) {
  const t = useTranslations()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belirtilmemiş'
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Blurred Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
      </div>

      {/* Paywall Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-red-200 dark:border-red-800 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <CardTitle className="text-2xl text-red-800 dark:text-red-200">
              {t('paywall.title')}
            </CardTitle>

            <CardDescription className="text-red-600 dark:text-red-300">
              {t('paywall.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Organization Info */}
            <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    {organizationName}
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Abonelik ödemesi beklemede
                  </p>
                </div>
                <Badge className="bg-red-600 text-white">
                  <Timer className="w-3 h-3 mr-1" />
                  Askıda
                </Badge>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">Ödenmemiş Tutar</p>
                    <p className="text-sm text-muted-foreground">
                      Son ödeme tarihi: {formatDate(dueDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(overdueAmount)}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Erişim Kısıtlandı
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Ödeme tamamlanana kadar sadece size atanan kartları görebilirsiniz.
                      Tüm workspace özelliklerine erişim için ödemenin tamamlanması gerekmektedir.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onPayment}
                className="w-full bg-brand-primary text-black hover:bg-brand-accent h-12 text-lg"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {t('paywall.payButton')}
              </Button>

              <Button
                variant="outline"
                onClick={onContactAdmin}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('paywall.contactAdmin')}
              </Button>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">İletişim Bilgileri</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Ödeme ile ilgili sorularınız için organizasyon yöneticinizle iletişime geçebilirsiniz.
                </p>
                <p>
                  <strong>Admin Email:</strong> {contactEmail}
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Ödeme Yöntemleri</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">iyzico</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Güvenli ödeme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 bg-gradient-to-r from-red-600 to-red-400 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PayTR</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Türk bankalarıyla uyumlu</span>
                </div>
              </div>
            </div>

            {/* Limited Access Notice */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Kısıtlı Erişim Modunda
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                    <li>• Sadece size atanan kartları görebilirsiniz</li>
                    <li>• Kart yorumları ve dosya ekleri erişilebilir</li>
                    <li>• Chat sadece kart konuşmaları için kullanılabilir</li>
                    <li>• Takvim ve raporlara erişim kısıtlı</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
