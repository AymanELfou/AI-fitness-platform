import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import update
from app.db.postgresql import init_postgres, close_postgres, async_session_factory
from app.models.postgres_models import User

async def run():
    await init_postgres()
    from app.db.postgresql import async_session_factory as factory
    async with factory() as session:
        await session.execute(update(User).where(User.id == 1).values(name="Ilyas", email="ilyas@test.com"))
        await session.commit()
        print("Nom mis à jour en Ilyas !")
    await close_postgres()

if __name__ == "__main__":
    asyncio.run(run())
