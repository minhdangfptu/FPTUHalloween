import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AboutUs() {
  const { t } = useTranslation()

  return (
    <div>{t('normal.aboutPage.title')}</div>
  )
}
