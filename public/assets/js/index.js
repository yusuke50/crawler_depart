function getList(areaID) {
  document.querySelector('.loader').classList.add('is-active');
  fetch(`getList?areaID=${areaID}`, {
    cache: 'no-cache',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then((res) => res.json())
    .then((resJ) => {
      for (let i = number = 0; i < resJ.length; i += 1) {
        for (let j = number = 0; j < resJ[i].length; j += 1) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${resJ[i][j].date}</td>
          <td>${resJ[i][j].name}</td>
          <td>${resJ[i][j].area}</td>
          <td>${resJ[i][j].address}</td>
          <td>${resJ[i][j].no}</td>
          <td>${resJ[i][j].approve}</td>
          <td>${resJ[i][j].note}</td>`;

          document.querySelector('.table tbody').appendChild(tr);
        }
      }

      document.querySelector('.loader').classList.remove('is-active');
    })
    .catch((err) => {
      document.querySelector('.loader').classList.remove('is-active');
      console.log(err);
    })
}

$(() => {
  getList(parseInt(document.getElementById('areaSelect').value), 10);

  document.querySelector('.btn-primary').addEventListener('click', () => {
    document.querySelector('tbody').innerHTML = '';
    getList(parseInt(document.getElementById('areaSelect').value), 10);
  })
});