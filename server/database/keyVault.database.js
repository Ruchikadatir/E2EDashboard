const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  const credential = new DefaultAzureCredential();
  const keyVaultName = "akv-am-eus-prod-dlg-sb13"
  const url = "https://" + keyVaultName + ".vault.azure.net";
  const client = new SecretClient(url, credential);
  const username = await client.getSecret('Username-SQLDB-sql-sb13');
  const password = await client.getSecret('Password-SQLDB-sql-sb13');
  return [username.value, password.value];
}

module.exports = { main };