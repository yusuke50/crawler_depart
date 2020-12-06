function getList() {
  document.querySelector('.loader').classList.add('is-active');
  fetch('/getList', {
    cache: 'no-cache',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then((res) => {
      document.querySelector('.loader').classList.remove('is-active');
      console.log(res.json())
    })
    .catch((err) => {
      document.querySelector('.loader').classList.remove('is-active');
      console.log(err);
    })
}

$(() => {
  getList();
});