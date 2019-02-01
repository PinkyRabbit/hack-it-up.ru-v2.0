module.exports.home = (req, res, next) => {
  res.locals.seo = {
    title: 'Домашняя страница блога вебразработчика',
    h1: 'Главная',
    keywords: 'developer, примеры, nodejs, учить',
    postimage: '/images/standart/main.jpg',
    description: 'Этот блог родился, когда я делал первые шаги в NodeJS. В нём я публикую свои мысли и заметки про программирование и лучше писать код.',
  };

  res.render('public/home');
};
