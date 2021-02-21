{
    'use strict';

    const titleClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;
        console.log('Link was clicked!');
        console.log(event);

        /* remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');

        for(let activeLink of activeLinks){
          activeLink.classList.remove('active');
        }

        /* add class 'active' to the clicked link */
        console.log('clickedElement:', clickedElement);
        clickedElement.classList.add('active');

        /* remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.post.active');

        for(let activeArticle of activeArticles){
          activeArticle.classList.remove('active');
        }

        /* get 'href' attribute from the clicked link */
        const articleSelector = clickedElement.getAttribute('href');
        // console.log('articleSelector', articleSelector);

        /* find the correct article using the selector (value of 'href' attribute) */
        const targetArticle = document.querySelector(articleSelector);
        // console.log(targetArticle);

        /* add class 'active' to the correct article */
        targetArticle.classList.add('active');
      }

      const optArticleSelector = '.post',
      optTitleSelector = '.post-title',
      optTitleListSelector = '.titles',
      optArticleTagSelectors = '.post-tags .list';


      const generateTitleLinks = function(){

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        // console.log(titleList);
        // console.log(titleList.innerHTML);

        titleList.innerHTML = '';


        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector);

        let html = '';

        for(let article of articles){
            // console.log('article', article);

            /* get the article id */
            const articleId = article.getAttribute('id');

            /* find the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            // console.log('articleTitle', articleTitle);

            /* get the title from the title element */

            /* create HTML of the link */
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            // console.log(linkHTML);

            /* insert link into titleList */
            html = html + linkHTML;
          }
          titleList.innerHTML = html;

          const links = document.querySelectorAll('.titles a');
          for(let link of links){
            link.addEventListener('click', titleClickHandler);
          }
        }

        generateTitleLinks();

        const generateTags = function(){
          /* find all articles */
          const articles = document.querySelectorAll(optArticleSelector);

          /* START LOOP: for every article: */
          for (let article of articles) {
            console.log('article', article);

            /* find tags wrapper */
            const tagWrapper = article.querySelector(optArticleTagSelectors);
            console.log('opto', optArticleTagSelectors);
            console.log('tagWrapper', tagWrapper);

            /* make html variable with empty string */
            let html = '';
            console.log('html', html);

            /* get tags from data-tags attribute */
            const articleTags = article.getAttribute('date-tags');
            console.log('articleTag', articleTags);

            /* split tags into array */
            const articleTagArray = articleTags.split(' ');
            console.log('articleTagArray', articleTagArray);

            /* START LOOP: for each tag */
            for (tag of articleTagArray){
              console.log('tag', tag);

              /* generate HTML of the link */
              const tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
              console.log('tagHTML', tagHTML);

              /* add generated code to html variable */
              html = html + tagHTML;
              console.log('html', html);
            /* END LOOP: for each tag */
            }
            /* insert HTML of all the links into the tags wrapper */
            tagWrapper.innerHTML = html;
            console.log('html', html);
            console.log('tagWrapperinner', tagWrapper.innerHTML);

          /* END LOOP: for every article: */
          }
        }

        generateTags();
      }
