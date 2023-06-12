useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(router.query.id);
        const dadosPerfil = await response.json();
        console.log(dadosPerfil);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    }

    fetchData();
  }, []);