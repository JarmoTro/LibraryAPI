<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a href="/" style="margin-left: 1rem;" class="text-decoration-none text-dark fs-3">Library</a>
          <form class="d-flex w-50">
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  All categories
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </div>
            <input class="form-control me-2" type="search" placeholder="Search by ISBN, title, author" aria-label="Search">
          </form>
          <form class="d-flex">
            <button class="btn btn-outline-dark" style="margin-right: 1rem;" type="submit"><i class="fa-solid fa-right-to-bracket fa-2x"></i></button>
          </form>
        </div>
      </nav>
</template>

