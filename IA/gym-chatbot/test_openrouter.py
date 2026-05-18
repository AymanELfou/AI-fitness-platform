import os
from openai import OpenAI # Surprise : on utilise la même bibliothèque qu'OpenAI !

# ÉTAPE 1 : Remplace par ta vraie clé OpenRouter
os.environ["OPENROUTER_API_KEY"] = "ta_cle_api_ici"

# Configuration pour dire à la librairie OpenAI de pointer vers OpenRouter
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.environ.get("OPENROUTER_API_KEY"),
)
  
print("Envoi de la demande au coach via OpenRouter...")

try:
    # On choisit un modèle (Llama 3 de Meta dans sa version gratuite pour tester)
    # Tu pourras changer le nom du modèle plus tard si tu veux payer un peu pour un modèle ultra-puissant
    response = client.chat.completions.create(
      model="openrouter/free",
      messages=[
        {"role": "system", "content": "Tu es un coach sportif ultra motivant d'une salle de sport. Reponds de manière concise et obligatoirement en Français."},
        {"role": "user", "content": "Bonjour ! J'ai 5 minutes devant moi. Quel exercice sans matériel me conseilles-tu aujourd'hui ?"},
      ],
    )
    
    print("\n--- RÉPONSE DU COACH IA ---")
    print(response.choices[0].message.content)
    print("---------------------------\n")

except Exception as e:
    print("\n❌ Une erreur est survenue ! Vérifie ta clé !")
    print("Erreur :", e)
