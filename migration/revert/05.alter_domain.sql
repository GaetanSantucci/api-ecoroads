ALTER DOMAIN postal_code_fr 
DROP CONSTRAINT "Code postal non valide, merci de renseigner un code situé en France métropolitaine" 
CHECK (
    -- 01000 à 09999
    VALUE ~ '0[1-9]\d{3}' 
    -- 10000 à 89999
    OR VALUE ~ '[1-8]\d{4}' 
    -- les numéros commençant par 9 en métropole
    OR VALUE ~ '9[0-6]\d{3}'
);