document.addEventListener('deviceready', function() {
    // Criação ou abertura do banco de dados
    const db = window.sqlitePlugin.openDatabase({ name: 'contas.db', location: 'default' });

    db.transaction(function(tx) {
        // Criação da tabela cadastro
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS cadastro (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, serie TEXT, telefone INTEGER, limite FLOAT, saldo FLOAT)',
            [],
            function(tx, res) {
                console.log("Tabela criada com sucesso!");
            },
            function(tx, error) {
                console.error("Erro ao criar tabela: " + error.message);
            }
        );
    });
});
