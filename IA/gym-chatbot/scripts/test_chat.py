"""Quick test to check the chat flow inside the container."""
import asyncio
from app.db.postgresql import init_postgres, close_postgres, async_session_factory
from app.db.mongodb import init_mongodb, close_mongodb
from app.services.chat_service import chat


async def test():
    try:
        await init_postgres()
        await init_mongodb()
        print("✅ Databases connected")

        factory = async_session_factory
        async with factory() as session:
            print("✅ Session created")
            result = await chat(
                user_message="Salut coach !",
                user_id=1,
                conversation_id=None,
                db_session=session,
            )
            print("✅ Chat result:", result)
    except Exception as e:
        print(f"❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await close_postgres()
        await close_mongodb()


if __name__ == "__main__":
    asyncio.run(test())
