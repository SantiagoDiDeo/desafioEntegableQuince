process.on('message', (cant) => {
    const results = {};
    for (let i = 0; i < cant; i++) {
      const num = Math.floor(Math.random() * 1000) + 1;
      results[num] = (results[num] || 0) + 1;
    }
    process.send(results);
  });