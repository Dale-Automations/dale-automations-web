import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(8, "Ingresa un teléfono válido"),
});

type FormData = z.infer<typeof formSchema>;

interface CallMeFormProps {
  children: React.ReactNode;
  className?: string; // wrapper (e.g., for orbit effect)
  triggerClassName?: string; // styles for the clickable trigger button
}

const CallMeForm = ({ children, className, triggerClassName }: CallMeFormProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting callback request:", data);
      
      const { data: result, error } = await supabase.functions.invoke(
        'save-callback-lead',
        {
          body: {
            name: data.name,
            phone: data.phone
          }
        }
      );

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      console.log("Callback request saved:", result);
      
      toast({
        title: t('callMe.success'),
        description: t('callMe.success'),
      });
      
      reset();
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting callback request:", error);
      toast({
        title: "Error",
        description: t('callMe.error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center">
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-brand-blue">
                <Phone className="h-5 w-5" />
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-lg">{t('callMe.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('callMe.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('callMe.form.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('callMe.form.name')}
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('callMe.form.phone')}</Label>
                <Input
                  id="phone"
                  placeholder="+541123456789"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('callMe.form.sending') : t('callMe.form.submit')}
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CallMeForm;