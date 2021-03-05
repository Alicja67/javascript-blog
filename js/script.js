{
'use strict';

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

  const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagSelectors = '.post-tags .list',
  optAuthorSelectors = '.post-author',
  optTagsListSelector = '.tags.list',
  optAuthorListSelector = '.authors.list',
  optCloudClassCount = 4,
  optCloudClassCountAuthor = 2,
  optCloudClassPrefix = 'tag-size-',
  optCloudClassPrefixAuthor = 'author-size-';


  const generateTitleLinks = function(customSelector = ''){
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';

    for(let article of articles){
      const articleId = article.getAttribute('id'),
      articleTitle = article.querySelector(optTitleSelector).innerHTML,
      linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li> ';
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
    const classNumber = Math.floor(percentage* (optCloudClassCount - 1) + 1);
    return optCloudClassPrefix + classNumber;
  }

  const generateTags = function(){
    let allTags = {};
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles){
      const tagWrapper = article.querySelector(optArticleTagSelectors);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagArray = articleTags.split(' ');

      for (let tag of articleTagArray){
        const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';
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

    let allTagsHTML = '';
    const tagsParams = calculateTagsParams(allTags);

    for(let tag in allTags){
      const tagLinkHTML = '<li><a class="' + calculateClassTag(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + '</span></a>';
      allTagsHTML += tagLinkHTML + ' (' + allTags[tag] + ') ';
    }
    tagList.innerHTML = allTagsHTML;
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
    const classNumber = Math.floor(percentage* (optCloudClassCountAuthor - 1) + 1);
    return optCloudClassPrefixAuthor + classNumber;
  }
  const generateAuthors = function(){
    let allAuthors = {};
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles){
      const authorWrapper = article.querySelector(optAuthorSelectors);
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      const authorHTML = '<a href="#author-' + articleAuthor + '"><span>by ' + articleAuthor + '</span></a>';

      if(!allAuthors[articleAuthor]) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      html = html + authorHTML;
      authorWrapper.innerHTML = html;
    }
    const authorList = document.querySelector('.authors');
    let allAuthorsHTML = '';
    const authorParams = calculateTagsParams(allAuthors);

    for(let author in allAuthors) {
      const authorLinkHTML = '<li><a class="' + calculateClassAuthor(allAuthors[author], authorParams) + '" href="#author-' + author + '"><span>' + author + '</span></a>';
      allAuthorsHTML += authorLinkHTML + ' (' + allAuthors[author] + ')';
    }
    authorList.innerHTML = allAuthorsHTML;
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

