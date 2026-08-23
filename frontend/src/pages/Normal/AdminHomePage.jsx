import React from 'react'
import { useTranslation } from 'react-i18next'

function AdminHomePage() {
  const { t } = useTranslation()

  return (
    <div>{t('normal.adminHomePage.title')}</div>
  )
}

export default AdminHomePage
