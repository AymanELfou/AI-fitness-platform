import os
from openai import OpenAI

# ÉTAPE 1 : Remplace 'TA_CLE_API_ICI' par la vraie clé que tu as générée
# Attention : garde bien les guillemets !
os.environ["OPENAI_API_KEY"] = "ta_cle_api_ici"

# Initialisation du client OpenAI
client = OpenAI()

print("Envoi de la demande au coach virtuel...")

try:
    # C'est ici qu'on définit le modèle et la conversation (le Prompt)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo", # Modèle rapide et peu coûteux pour tester
        messages=[
            {"role": "system", "content": "Tu es un coach sportif ultra motivant d'une salle de sport."},
            {"role": "user", "content": "Bonjour ! J'ai 5 minutes devant moi. Quel exercice sans matériel me conseilles-tu aujourd'hui ?"}
        ]
    )

    # Affichage de la réponse générée par l'IA
    print("\n--- RÉPONSE DU COACH IA ---")
    print(response.choices[0].message.content)
    print("---------------------------\n")

except Exception as e:
    print("\n❌ Une erreur est survenue. Vérifie que ta clé API est correcte ou que ton compte OpenAI est bien configuré/crédité.")
    print("Détails de l'erreur :", e)
