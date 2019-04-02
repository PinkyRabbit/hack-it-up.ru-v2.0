'use strict';

/* eslint-disable prefer-template */
module.exports = (docs, page, limit, path) => {
  const pages = Math.ceil(docs.length / limit);
  const pagination = [
    '<nav aria-label="Page navigation" class="text-center">',
    '<ul class="pagination">',
  ];

  if (!pages || pages < 8) {
    for (let i = 1; i < (pages + 1); i += 1) {
      const elem = i === page
        ? `<li class="active"><a href="#" class="prevent">${page} <span class="sr-only">(current)</span></a></li>`
        : `<li><a href="${path}${i !== 1 ? '?page=' + i : ''}">${i}</a></li>`;
      pagination.push(elem);
    }
  } else {
    if (page !== 1) {
      pagination.push(`<li><a href="${path}${(page - 1) !== 1 ? '?page=' + (page - 1) : ''}" aria-label="Previous" title="Назад">`);
      pagination.push('<span aria-hidden="true">&laquo;</span>');
      pagination.push('</a></li>');
    }

    if (page < 6) {
      for (let i = 1; i < 7; i += 1) {
        const elem = i === page
          ? `<li class="active"><a href="#" class="prevent">${page} <span class="sr-only">(current)</span></a></li>`
          : `<li><a href="${path}${i !== 1 ? '?page=' + i : ''}">${i}</a></li>`;
        pagination.push(elem);
      }
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      pagination.push(`<li><a href="${path}?page=${pages}">${pages}</a></li>`);
    } else if (page > (pages - 5)) {
      pagination.push(`<li><a href="${path}">1</a></li>`);
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      for (let i = (pages - 5); i < (pages + 1); i += 1) {
        const elem = i === page
          ? `<li class="active"><a href="#" class="prevent">${page} <span class="sr-only">(current)</span></a></li>`
          : `<li><a href="${path}?page=${i}">${i}</a></li>`;
        pagination.push(elem);
      }
    } else {
      pagination.push(`<li><a href="${path}">1</a></li>`);
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      pagination.push(`<li><a href="${path}?page=${page - 1}">${page - 1}</a></li>`);
      pagination.push(`<li class="active"><a href="${path}?page=${page}" class="prevent">${page}</a></li>`);
      pagination.push(`<li><a href="${path}?page=${page + 1}">${page + 1}</a></li>`);
      pagination.push('<li><a href="#" class="prevent">..</a></li>');
      pagination.push(`<li><a href="${path}?page=${pages}">${pages}</a></li>`);
    }

    if (page !== pages) {
      pagination.push(`<li><a href="${path}?page=${page + 1}" aria-label="Next" title="Вперёд">`);
      pagination.push('<span aria-hidden="true">&raquo;</span>');
      pagination.push('</a></li>');
    }
  }
  pagination.push('</ul></nav>');
  return pagination.join('');
};
