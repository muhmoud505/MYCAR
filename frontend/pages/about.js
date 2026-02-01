import React from 'react'
import { useLocale } from '../contexts/LocaleContext'
import Navbar from '../components/Navbar'
import { Icon } from '../components/UI'

export default function AboutPage(){
  const { locale } = useLocale()
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'من نحن' : 'About Us'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'ar' 
              ? 'منصة MYCAR هي وجهتك الموثوقة لشراء وبيع السيارات، تجمع بين البائعين والبائعين في سوق واحد آمن وموثوق'
              : 'MYCAR is your trusted platform for buying and selling cars, connecting buyers and sellers in one secure and reliable marketplace'
            }
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Icon icon="target" className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'مهمتنا' : 'Our Mission'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {locale === 'ar' 
                  ? 'نسعى في تبسيط عملية شراء وبيع السيارات من خلال توفير منصة سهلة الاستخدام وآمنة وموثوقة. نؤمن تجربة شفافة ومعلومات دقيقة لمساعدتك على اتخاذ قرار صحيح بثقة.'
                  : 'We aim to simplify the car buying and selling process by providing an easy-to-use, secure, and reliable platform. We ensure a transparent experience with accurate information to help you make confident decisions.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Icon icon="eye" className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {locale === 'ar' 
                  ? 'أن نكون المنصة الرائدة في سوق السيارات الإقليمي، حيث يجد كل شخص السيارة المثالية له بسهولة وثقة.'
                  : 'To become the leading car marketplace in the region, where everyone can find their perfect vehicle with ease and confidence.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {locale === 'ar' ? 'قيمنا' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="shield" className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'ar' ? 'الثقة' : 'Trust'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ar' ? 'نحن نبني الثقة من خلال الشفافية والأمان' : 'We build trust through transparency and security'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="users" className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'ar' ? 'العملاء' : 'Community'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ar' ? 'ندعم مجتمع من المشترين والبائعين الموثوقين' : 'We foster a community of trusted buyers and sellers'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="star" className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === 'ar' ? 'الجودة' : 'Quality'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ar' ? 'نضمن أعلى معايير الجودة في كل معاملة' : 'We ensure the highest quality standards in every transaction'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary-600 rounded-lg shadow-sm p-8 mb-8 text-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {locale === 'ar' ? 'إنجازاتنا' : 'Our Achievements'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-primary-100">
                {locale === 'ar' ? 'سيارة معروضة' : 'Cars Listed'}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="text-primary-100">
                {locale === 'ar' ? 'عميل سعيد' : 'Happy Customers'}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-primary-100">
                {locale === 'ar' ? 'وكالات موثوقة' : 'Verified Dealers'}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-primary-100">
                {locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {locale === 'ar' ? 'فريقنا' : 'Our Team'}
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'فريق من الخبراء المتخصصين في صناعة السيارات يعملون جاهدين لخدمتك'
              : 'A team of automotive experts dedicated to serving you'
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Icon icon="user" className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locale === 'ar' ? 'خبراء السيارات' : 'Automotive Experts'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ar' ? 'فريق من المحترفين في تقييم وعرض السيارات' : 'Team of professionals in car evaluation and presentation'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Icon icon="support" className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locale === 'ar' ? 'دعميل العملاء' : 'Customer Support'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ar' ? 'دعميل على مدار الساعة لمساعدتك في كل خطوة' : '24/7 support to help you every step of the way'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Icon icon="shield" className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locale === 'ar' ? 'فريق الأمان' : 'Security Team'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ar' ? 'حماية بياناتك وضمان معاملات آمنة' : 'Protecting your data and ensuring secure transactions'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'هل لديك أي أسئلة أو اقتراحات؟ نحن هنا لمساعدتك'
              : 'Have any questions or suggestions? We are here to help'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn btn-primary">
              <Icon icon="mail" className="w-4 h-4 mr-2" />
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </a>
            <a href="mailto:info@mycar.com" className="btn btn-outline">
              <Icon icon="send" className="w-4 h-4 mr-2" />
              {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Us'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
