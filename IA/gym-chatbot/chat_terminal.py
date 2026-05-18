import requests
import json

API_URL = "http://localhost:8000/api/chat"
USER_ID = 1  # L'ID de Ilyas

print("=============================================")
print("🤖 BIENVENUE DANS TON COACH SPORTIF IA (V2) 🤖")
print("=============================================")
print("(Tape 'quit' ou 'exit' pour arrêter)\n")

conversation_id = None

while True:
    message = input("Taper un message 💬 : ")
    
    if message.lower() in ['quit', 'exit']:
        print("À bientôt pour le prochain entraînement ! 💪")
        break
        
    print("⏳ Le coach réfléchit...\n")
    
    # On prépare la requête pour l'API
    payload = {
        "message": message,
        "user_id": USER_ID
    }
    
    # On ajoute l'ID de conversation s'il existe pour garder le contexte
    if conversation_id:
        payload["conversation_id"] = conversation_id
        
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status() # Vérifie s'il y a une erreur
        
        data = response.json()
        print(f"🏋️‍♂️ COACH :\n{data['response']}\n")
        
        # On sauvegarde l'ID de la conversation pour le prochain message
        conversation_id = data['conversation_id']
        
    except Exception as e:
        print(f"❌ Erreur de communication avec l'API : {e}")
