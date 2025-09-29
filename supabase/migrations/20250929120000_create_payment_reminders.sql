-- Create payment reminders table for monthly bills/installments
CREATE TABLE public.payment_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  total_installments INTEGER NOT NULL DEFAULT 1 CHECK (total_installments >= 1),
  first_due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own payment reminders"
ON public.payment_reminders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment reminders"
ON public.payment_reminders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment reminders"
ON public.payment_reminders
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment reminders"
ON public.payment_reminders
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes to speed up queries
CREATE INDEX idx_payment_reminders_user_due_created
ON public.payment_reminders (user_id, first_due_date ASC, created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_payment_reminders_updated_at
  BEFORE UPDATE ON public.payment_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


