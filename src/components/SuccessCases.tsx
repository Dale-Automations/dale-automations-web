import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, ShoppingCart, GraduationCap } from "lucide-react";
import { useTranslation } from 'react-i18next';

const SuccessCases = () => {
  const { t } = useTranslation();
  
  return (
    <section id="cases" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('successCases.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('successCases.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Marketing con Belu */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/lovable-uploads/b98ed61f-1fc7-441c-87a3-0e39829ea95f.png" 
                    alt="Marketing con Belu" 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-xl font-bold text-brand-navy">
                      {t('successCases.belu.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('successCases.belu.challenge')}
                    </CardDescription>
                  </div>
                </div>
                <GraduationCap className="h-8 w-8 text-brand-blue" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-brand-light/20 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-navy mb-2">{t('successCases.belu.challenge')}:</h4>
                <p className="text-sm text-muted-foreground">
                  {t('successCases.belu.challengeText')}
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-brand-navy mb-1">{t('successCases.belu.solution')}:</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('successCases.belu.solutionText')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 ml-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Da de alta el cliente en Kajabi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Asigna automáticamente el curso comprado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Envía email de confirmación personalizado</span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-1">{t('successCases.belu.results')}:</h4>
                <p className="text-sm text-green-700">
                  {t('successCases.belu.resultsText')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cursos GM */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/lovable-uploads/a8579d7f-435d-4bd2-8bbc-edcb8a80eeab.png" 
                    alt="GM Cursos Academia de Belleza" 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-xl font-bold text-brand-navy">
                      {t('successCases.gm.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('successCases.gm.challenge')}
                    </CardDescription>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-brand-blue" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-brand-light/20 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-navy mb-2">{t('successCases.gm.challenge')}:</h4>
                <p className="text-sm text-muted-foreground">
                  {t('successCases.gm.challengeText')}
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-brand-navy mb-1">{t('successCases.gm.solution')}:</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('successCases.gm.solutionText')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 ml-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Monitoreo automático de nuevas compras</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Carga datos en Google Sheets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Alta automática en TiendUp vía Browserflow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Asignación automática de cursos</span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-1">{t('successCases.gm.results')}:</h4>
                <p className="text-sm text-green-700">
                  {t('successCases.gm.resultsText')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SuccessCases;