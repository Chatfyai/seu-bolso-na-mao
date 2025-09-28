-- Add granular onboarding status fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_account_type_completed BOOLEAN DEFAULT false,
ADD COLUMN onboarding_setup_completed BOOLEAN DEFAULT false,
ADD COLUMN onboarding_charts_completed BOOLEAN DEFAULT false;

-- Update existing users who have onboarding_completed = true to have all steps completed
UPDATE public.profiles 
SET onboarding_account_type_completed = true,
    onboarding_setup_completed = true, 
    onboarding_charts_completed = true
WHERE onboarding_completed = true;