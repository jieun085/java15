let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async() => {

  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);

    const data = await response.json();
    console.log("Ddd",data);

    if (response.status == 200){
      if(data.articles.length === 0){
        throw new Error("No result for this search")
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    }
    else{
      throw new Error(data.message);
    }
    
  } catch (error) {
      errorRender(error.message);
  }
  
  
}

const getLatestNews = async () => {
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
                        
    getNews();
};

const getNewsByCategory = async (event) => {

    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);
      getNews();

}

const getNewsByKeyword = async() => {

  const keyword = document.getElementById("search-input").value
  
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  // `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}` 
      getNews();

}

const render = () => {
    const newsHTML = newsList.map(news =>`  <div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" src = "${news.urlToImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSkdGbj-QrUuNqhXP7DtY3-t8yD6H1Tk4uFg&s'}"/>
        </div>

        <div class="col-lg-8">
          <h2>${news.title}</h2>
          <p>
              ${news.description}
          </p>  
          <div>
              ${news.source.name} * ${news.publishedAt} 
          </div>
        </div>
      </div>`).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert"> 
    ${errorMessage}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
}

const paginationRender = () => {
    const totalPages = Math.ceil(totalResults / pageSize);

    const pageGroup = Math.ceil(page/groupSize);

    const lastPage = pageGroup * groupSize;
    if(lastPage > totalPages){
        lastPage = totalPages;
    };

    const firstPage = 
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    let paginationHTML = `<li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">Previous</a></li>`

    for(let i = firstPage; i <= lastPage ; i++){
      paginationHTML += `<li class="page-item ${
        i===page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }

    paginationHTML += `<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">Next</a></li>`

    document.querySelector(".pagination").innerHTML = paginationHTML;

  //   <nav aria-label="Page navigation example">
  //    <ul class="pagination">
  //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
  //   </ul>
  //  </nav>


    // totalPages
};

const moveToPage = (pageNum) => {
    console.log("mpvetopage", pageNum);
    page=pageNum;
    getNews();
};

getLatestNews();

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };