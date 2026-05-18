import google.generativeai as genai
import os

# ÉTAPE 1 : Remplace 'TA_CLE_API_GEMINI_ICI' par la vraie clé générée sur Google AI Studio
os.environ["GEMINI_API_KEY"] = "TA_CLE_API_GEMINI_ICI"

# Initialisation de l'API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

print("Envoi de la demande au coach virtuel (Gemini)...")

try:
    # Choix du modèle gratuit et rapide
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # C'est ici qu'on définit le Prompt : on mélange le rôle et la question
    prompt = """Tu es un coach sportif ultra motivant d'une salle de sport.
    Bonjour ! J'ai 5 minutes devant moi. Quel exercice sans matériel me conseilles-tu aujourd'hui ?"""

    # Envoi de la demande à l'IA
    response = model.generate_content(prompt)

    # Affichage de la réponse générée par l'IA
    print("\n--- RÉPONSE DU COACH IA ---")
    print(response.text)
    print("---------------------------\n")

except Exception as e:
    print("\n❌ Une erreur est survenue ! Vérifie que la clé est correcte.")
    print("Détails de l'erreur :", e)
