import os
import json
from openai import OpenAI

# Toujours utiliser ta clé API OpenRouter
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.environ.get("OPENROUTER_API_KEY"), 
  # Assure-toi que la variable d'environnement OPENROUTER_API_KEY est bien configurée !
)

def generer_programme_json(machines_disponibles, objectif_utilisateur, frequence_hebdo, duree_seance):
    """
    Cette fonction est le 'cœur' de ton chatbot. Elle prend les données du club 
    et de l'utilisateur, et retourne un programme structuré en JSON.
    """
    
    # 1. On définit le comportement de l'IA (Le Prompt Système)
    prompt_systeme = """Tu es un coach sportif IA travaillant pour un réseau de salles de sport.
Ton rôle est de créer un programme d'entraînement hebdomadaire personnalisé.

RÈGLES STRICTES :
1. N'utilise QUE les machines listées. Si aucune machine n'existe pour un groupe musculaire, donne un exercice au poids du corps.
2. Adapte l'intensité à l'objectif de l'utilisateur.
3. Tu dois répondre UNIQUEMENT avec un objet JSON valide (aucun autre texte, pas de bonjour, pas d'explication).

FORMAT JSON OBLIGATOIRE :
{
  "objectif_principal": "...",
  "programme": [
    {
      "jour": 1,
      "focus": "...",
      "exercices": [
        {"nom": "...", "machine_utilisee": "...", "series": 3, "repetitions": "10-12"}
      ]
    }
  ]
}"""

    # 2. On injecte les données de l'application (Le Prompt Utilisateur)
    prompt_utilisateur = f"""
    - Objectif de l'utilisateur : {objectif_utilisateur}
    - Fréquence : {frequence_hebdo} fois par semaine
    - Durée de la séance : {duree_seance} minutes
    - Machine du club disponibles : {', '.join(machines_disponibles)}
    
    Génère le programme en JSON.
    """

    print("Génération du programme en cours (cela peut prendre quelques secondes)...")
    try:
        # 3. Appel à l'IA
        response = client.chat.completions.create(
          model="openrouter/free", # Toujours utiliser le mode automatique pour éviter les erreurs
          messages=[
            {"role": "system", "content": prompt_systeme},
            {"role": "user", "content": prompt_utilisateur},
          ],
        )
        
        # 4. Nettoyage de la réponse
        reponse_texte = response.choices[0].message.content
        
        # Parfois l'IA renvoie le JSON entouré de "```json", on sécurise :
        if "```json" in reponse_texte:
            reponse_texte = reponse_texte.split("```json")[1].split("```")[0].strip()
        elif "```" in reponse_texte:
            reponse_texte = reponse_texte.split("```")[1].split("```")[0].strip()

        # 5. Conversion du texte en vrai objet de données manipulable (Dictionnaire Python / JSON)
        programme_json = json.loads(reponse_texte)
        return programme_json

    except json.JSONDecodeError:
        print("Erreur : L'IA n'a pas répondu avec un format JSON valide.")
        print("Réponse brute reçue :", reponse_texte)
        return None
    except Exception as e:
        print("Erreur de connexion à l'API :", e)
        return None

# --- SIMULATEUR INTERACTIF POUR TESTER TON IA ---
if __name__ == "__main__":
    print("=== BIENVENUE DANS LE SIMULATEUR DE COACH IA ===")
    print("Ce script permet de tester la 'brique intelligente' de ton projet.\n")

    # 1. On demande les informations à l'utilisateur
    objectif = input("Quel est votre objectif (ex: Perte de poids, Prise de muscle) ? : ")
    frequence = input("Combien de jours par semaine pouvez-vous vous entraîner ? : ")
    duree = input("Combien de minutes dure une séance idéale pour vous ? : ")
    
    print("\nQuelles machines sont disponibles dans votre club ?")
    print("(Séparez-les par une virgule, ex: Tapis, Haltères, Presse à jambes)")
    machines_texte = input("Machines : ")
    liste_machines = [m.strip() for m in machines_texte.split(",")]

    # 2. On appelle notre fonction d'intelligence artificielle
    mon_programme = generer_programme_json(
        machines_disponibles=liste_machines,
        objectif_utilisateur=objectif,
        frequence_hebdo=frequence,
        duree_seance=duree
    )
    
    # 3. On affiche le résultat
    if mon_programme:
        print("\n✅ PROGRAMME GÉNÉRÉ AVEC SUCCÈS !")
        print("Voici le JSON que tu pourras donner au responsable Backend :\n")
        print(json.dumps(mon_programme, indent=2, ensure_ascii=False))
    else:
        print("\n❌ La génération a échoué. Vérifie ta connexion ou ta clé API.")
