import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Instagram, MessageCircle, Calendar, TrendingUp, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';
import ascendAiImage from "@/assets/ascend-ai-hero.jpg";
import socialMediaImage from "@/assets/social-media-automation.jpg";

const Solutions = () => {
  const { t } = useTranslation();
  
  return (
    <section id="solutions" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('solutions.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('solutions.subtitle')}
          </p>
        </div>

        {/* Soluciones a Medida - Full Width */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-brand-navy mb-4">
                {t('solutions.custom.title')}
              </CardTitle>
              <CardDescription className="text-xl max-w-3xl mx-auto">
                {t('solutions.custom.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-brand-navy">{t('solutions.custom.features.automation')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('solutions.custom.features.automation')}
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-brand-navy">{t('solutions.custom.features.optimization')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('solutions.custom.features.optimization')}
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-brand-navy">{t('solutions.custom.features.reduction')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('solutions.custom.features.reduction')}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                  {t('solutions.custom.subtitle')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Soluciones Pre-armadas */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-brand-navy mb-4">
            {t('solutions.preBuilt.title')}
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('solutions.preBuilt.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ascend AI */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={ascendAiImage} 
                alt="Ascend AI - Sistema de llamadas inteligente" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-brand-navy mb-2">
                {t('solutions.ascend.title')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t('solutions.ascend.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.ascend.features.natural')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.ascend.features.integration')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.ascend.features.analytics')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.ascend.features.analytics')}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                {t('solutions.ascend.description')}
              </p>
            </CardContent>
          </Card>

          {/* Social Media Automation */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={socialMediaImage} 
                alt="Automatización de Redes Sociales con IA" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-brand-navy mb-2">
                {t('solutions.social.title')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t('solutions.social.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.social.features.content')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.social.features.scheduling')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.social.features.engagement')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">{t('solutions.social.features.analytics')}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                {t('solutions.social.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Solutions;