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
  optCloudClassCount = 4,
  optCloudClassPrefix = 'tag-size-';


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
        const tagHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';
        html = html + tagHTML;

        if(!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
          console.log('allTags', allTags);
        } else {
          allTags[tag]++;
        }
      }

      tagWrapper.innerHTML = html;
    }
    const tagList = document.querySelector('.tags');

    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      const tagHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';
      // console.log('tagHTML', tagHTML);
      // const tagLinkHTML ='<li>' + calculateClassTag(allTags[tag], tagsParams) + '</li>';
      const tagLinkHTML = '<li><a class="' + calculateClassTag(allTags[tag], tagsParams) + '" href="#tag-' + tag + '"><span>' + tag + '</span></a>';
      /* [NEW] generate code of a link and add it to allTagsHTML */
      // allTagsHTML += tagHTML + ' (' + allTags[tag] + ') ';
      allTagsHTML += tagLinkHTML;
      console.log('tagLinkHTML:', tagLinkHTML);

    }
    console.log('allTagsHTML', allTagsHTML);
    console.log('tagList', tagList);
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
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

  const generateAuthors = function(){
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles){
      const authorWrapper = article.querySelector(optAuthorSelectors);
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      const authorHTML = '<a href="#author-' + articleAuthor + '"><span>by ' + articleAuthor + '</span></a>';

      html = html + authorHTML;

      authorWrapper.innerHTML = html;
    }
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

