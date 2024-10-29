function adicionarConta(nome, serie, telefone, limite, saldo) {
    const db = window.sqlitePlugin.openDatabase({ name: 'contas.db', location: 'default' });
    db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO cadastro (nome, serie, telefone, limite, saldo) VALUES (nome, serie, telefone, limite, saldo)',
            [nome, serie, telefone, limite, saldo],
            function (tx, res) {
                console.log("Conta adicionada com sucesso!");
                listarContas(); // Atualiza a tabela após adicionar uma nova conta
            },
            function (tx, error) {
                console.error("Erro ao adicionar conta: " + error.message);
            }
        );
    });
}


function listarPessoas() {
    const db = window.sqlitePlugin.openDatabase({ name: 'contas.db', location: 'default' });

    db.transaction(function (tx) {
        tx.executeSql(
            'SELECT * FROM cadastro',
            [],
            function (tx, res) {
                const len = res.rows.length;
                for (let i = 0; i < len; i++) {  // Corrigido para `i < len`
                    const item = res.rows.item(i);
                    console.log("ID: " + item.id + ", Nome: " + item.nome + ", Série: " + item.serie + ", Limite: " + item.limite + ", Telefone: " + item.telefone + ", Saldo: " + item.saldo);
                }
            },
            function (tx, error) {
                console.error("Erro ao listar pessoas: " + error.message);
            }
        );
    });
}


function atualizarPessoa(id, novoNome, novaSerie, novoTel, novoLim, novoSal) {
    const db = window.sqlitePlugin.openDatabase({ name: 'contas.db', location: 'default' });

    db.transaction(function(tx) {
        tx.executeSql(
            'UPDATE cadastro SET nome = ?, serie = ?, telefone = ?, limite = ?, saldo = ? WHERE id = ?',
            [novoNome, novaSerie, novoTel, novoLim, novoSal, id],
            function(tx, res) {
                console.log("Dados atualizados com sucesso!");
            },
            function(tx, error) {
                console.error("Erro ao atualizar dados: " + error.message);
            }
        );
    });
}


function deletarPessoa(id) {
    const db = window.sqlitePlugin.openDatabase({ name: 'contas.db', location: 'default' });

    db.transaction(function(tx) {
        tx.executeSql(
            'DELETE FROM cadastro WHERE id = ?',
            [id],
            function(tx, res) {
                console.log("Pessoa deletada com sucesso!");
            },
            function(tx, error) {
                console.error("Erro ao deletar pessoa: " + error.message);
            }
        );
    });
}
