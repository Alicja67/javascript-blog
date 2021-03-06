{
  'use strict';
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagArticleLink: Handlebars.compile(document.querySelector('#template-tag-article-link').innerHTML),
    authorArticleLink: Handlebars.compile(document.querySelector('#template-author-article-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
  }
  const select = {
    all: {
      articles: '.post',
    },
    article: {
      tags: '.post-tags .list',
      authors: '.post-author',
      title: '.post-title',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.authors.list',
    },
  };
  const opts = {
    tagSizes: {
      count: 4,
      classPrefix: 'tag-size-',
    },
    authorSizes: {
      count: 2,
      classPrefix: 'author-size-',
    },
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    console.log('Link was clicked!')
    const clickedElement = this;
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');
    const activeArticles = document.querySelectorAll('.post.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);

    targetArticle.classList.add('active');
  }

  const generateTitleLinks = function(customSelector = ''){
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    let html = '';

    for(let article of articles){
      const articleId = article.getAttribute('id'),
      articleTitle = article.querySelector(select.article.title).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      html = html + linkHTML;
    }

    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }
  generateTitleLinks();

  const calculateTagsParams = function(tags) {
    const params = {
      max: 0,
      min: 9999,
    };
    for(let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
      params.min = Math.min(tags[tag], params.min);
      params.max = Math.max(tags[tag], params.max);
    }
    console.log('params', params);
    return params;
  }

  const calculateClassTag = function(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage* (opts.tagSizes.count - 1) + 1);
    return opts.tagSizes.classPrefix + classNumber;
  }

  const generateTags = function(){
    let allTags = {};
    const articles = document.querySelectorAll(select.all.articles);

    for (let article of articles){
      const tagWrapper = article.querySelector(select.article.tags);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagArray = articleTags.split(' ');

      for (let tag of articleTagArray){
        const linkHTMLData = {tags: tag};
        const linkHTML = templates.tagArticleLink(linkHTMLData);
        html = html + linkHTML;

        if(!allTags[tag]) {
          allTags[tag] = 1;
          console.log('allTags', allTags);
        } else {
          allTags[tag]++;
        }
      }
      tagWrapper.innerHTML = html;
    }

    const tagList = document.querySelector('.tags');

    const allTagsData = {tags: []};
    const tagsParams = calculateTagsParams(allTags);

    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateClassTag(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log('allTagsData', allTagsData);
  }
  generateTags();

  const tagClickHandler = function(event){
    event.preventDefault();
    console.log('Link was clicked!');

    const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#tag-', ''),
    activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

    for(let activeTag of activeTags){
      activeTag.classList.remove('active');
    }

    const tagAll = document.querySelectorAll('a[href="' + href + '"]');

    for(let clickedTag of tagAll){
      clickedTag.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  const addClickListenersToTags = function(){
    const tags = document.querySelectorAll('a[href^="#tag-"]');

    for(let tag of tags){
      tag.addEventListener('click', tagClickHandler);
    }
  }
  addClickListenersToTags();

  const calculateClassAuthor = function(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage* (opts.authorSizes.count - 1) + 1);
    return opts.tagSizes.classPrefix + classNumber;
  }
  const generateAuthors = function(){
    let allAuthors = {};
    const articles = document.querySelectorAll(select.all.articles);

    for (let article of articles){
      const authorWrapper = article.querySelector(select.article.authors);
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      const authorHTMLData = {author: articleAuthor};
      const authorHTML = templates.authorArticleLink(authorHTMLData);
      if(!allAuthors[articleAuthor]) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      html = html + authorHTML;
      authorWrapper.innerHTML = html;
    }
    const authorList = document.querySelector('.authors');
    const allAuthorsData = {allAuthors: []}
    const authorParams = calculateTagsParams(allAuthors);

    for(let author in allAuthors) {
      allAuthorsData.allAuthors.push({
        author: author,
        count: allAuthors[author],
        className: calculateClassAuthor(allAuthors[author], authorParams)
      });
    }
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
    console.log('allAuthorsData', allAuthorsData);
  }
  generateAuthors();

  const authorClickHandler = function(event){
    event.preventDefault();
    console.log('Link was clicked!');

    const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    author = href.replace('#author-', ''),
    activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

    for(let activeAuthor of activeAuthors){
      activeAuthor.classList.remove('active');
    }

    const authorAll = document.querySelectorAll('a[href="' + href + '"]');

    for(let authorLink of authorAll){
      authorLink.classList.add('active');
    }

    generateTitleLinks('[data-author="' + author + '"]');
  }

  const addClickListenersToAuthor = function(){
    const links = document.querySelectorAll('a[href^="#author-"]');

    for(let link of links){
      link.addEventListener('click', authorClickHandler);
    }
  }
  addClickListenersToAuthor();
}

