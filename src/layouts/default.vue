<template lang="pug">
  main(class="flex flex-col h-screen")
    nav(class="hidden flex flez-wrap relative items-center justify-between bg-pink-500 h-16 px-2 py-3 p-4 lg:block")
      .container.px-4.mx-auto.flex.flex-wrap.items-center.justify-between
        .w-full.relative.flex.justify-between.px-4(class='lg:w-auto lg:static lg:block lg:justify-start')
          NuxtLink.text-sm.font-bold.leading-relaxed.inline-block.mr-4.py-2.whitespace-no-wrap.uppercase.text-white(to="/")
            | Khuise
        #example-navbar-warning.flex-grow.items-center(class='lg:flex')
          ul.flex.flex-col.list-none.ml-auto(class='lg:flex-row')
            li.nav-item
              NuxtLink.px-3.py-2.flex.items-center.text-xs.uppercase.font-bold.leading-snug.text-white(class='hover:opacity-75' to="/")
                | Inicio
            li.nav-item
              NuxtLink.px-3.py-2.flex.items-center.text-xs.uppercase.font-bold.leading-snug.text-white(class='hover:opacity-75' to="/products")
                | Produtos
            li.nav-item
              NuxtLink.px-3.py-2.flex.items-center.text-xs.uppercase.font-bold.leading-snug.text-white(class="hover:opacity-75" to="/account")
                | Conta
    div(class="flex flex-1 overflow-hidden")
      Nuxt
    div(class="flex lg:hidden")
      nav.w-full.bg-pink-500
        .flex.justify-between
          a.w-full.justify-center.inline-block.text-center.pt-2.pb-1(href='#' class='focus:text-teal-500 hover:text-teal-500')
            span.material-icons(style="font-size: 1.875rem") home
            span.block.text-xs.-mt-2 Home
          a.w-full.justify-center.inline-block.text-center.pt-2.pb-1(href='#' class='focus:text-teal-500 hover:text-teal-500')
            span.material-icons(style="font-size: 1.875rem") home
            span.block.text-xs.-mt-2 Category
          a.w-full.justify-center.inline-block.text-center.pt-2.pb-1(href='#' class='focus:text-teal-500 hover:text-teal-500')
            span.material-icons(style="font-size: 1.875rem") home
            span.block.text-xs.-mt-2 Explore
</template>

