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
      // Aquí se enviaría a tu endpoint de callback
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      
      toast({
        title: "¡Solicitud enviada!",
        description: "Te llamaremos en los próximos minutos.",
      });
      
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema. Inténtalo de nuevo.",
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
              <h3 className="font-semibold text-lg">Te llamamos instantáneamente</h3>
              <p className="text-sm text-muted-foreground">Disponible 24/7</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
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
                {isSubmitting ? "Enviando..." : "Llamar Ahora"}
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CallMeForm;