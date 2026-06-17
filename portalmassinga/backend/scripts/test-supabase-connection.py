import os
import sys

try:
    import psycopg2
except ImportError:
    print("pip install psycopg2-binary")
    sys.exit(1)

config = {
    "host": os.getenv("DB_HOST", "db.hfrerqbbfccrfordetut.supabase.co"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "dbname": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
    "sslmode": "require",
}

if not config["password"]:
    print("Defina DB_PASSWORD")
    sys.exit(1)

conn = psycopg2.connect(**config)
cur = conn.cursor()
cur.execute("SELECT version()")
print("Conexao OK")
cur.execute(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros')"
)
print("Tabela membros:", cur.fetchone()[0])
if cur.fetchone is not None:
    try:
        cur.execute("SELECT COUNT(*) FROM membros")
        print("Total membros:", cur.fetchone()[0])
    except Exception as e:
        print("membros:", e)
conn.close()
