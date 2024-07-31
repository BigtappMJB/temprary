import os
from dotenv import load_dotenv

def load_environment(env):
    # dotenv_file = f"D:\React Project\Rapid_Development_Application\Python_Backend\poc_snow_flake\share\environments\env.{env}"
    dotenv_file = f"environments/.env.{env}"
    if os.path.exists(dotenv_file):
        load_dotenv(dotenv_file)
        print(f"Loaded {dotenv_file}")
    else:
        raise FileNotFoundError(f"{dotenv_file} does not exist")

env_var = os.getenv('APP_ENV', 'dev')
print(f"The default env {env_var}")
load_environment(env_var)

sender_mail_config = {
    "username": os.getenv('EMAIL_USERNAME'),
    "password": os.getenv('EMAIL_PASSWORD'),
    "server": os.getenv('SMTP_SERVER'),
    "port": int(os.getenv('SMTP_PORT')),
    "use_tls": os.getenv('MAIL_USE_TLS').lower() == 'true',
}

llm_config = {
    "openAI": os.getenv('OPENAI_API_KEY'),
}

shed_time = int(os.getenv('SCHEDULED_IN_SEC'))


snow_conf = {
    "user": os.getenv('SNOWFLAKE_USER'),
    "password": os.getenv('SNOWFLAKE_PASSWORD'),
    "account": os.getenv('SNOWFLAKE_ACCOUNT'),
    "warehouse": os.getenv('SNOWFLAKE_WAREHOUSE'),
    "database": os.getenv('SNOWFLAKE_DATABASE'),
    "schema": os.getenv('SNOWFLAKE_SCHEMA'),
    "role": os.getenv('SNOWFLAKE_ROLE')
}
