import Link from "next/link";


const Paginate = ({pages, page, isAdmin = false, searchTerm = "", sortTerm = "", categoryTerm}) => {
    return (
       pages > 1 && (
               [...Array(pages).keys()].map(function (pg, index) {
                    return (
                       <Link className={`join-item btn ${pg + 1 === Number(page) && "bg-neutral text-white sm:hover:bg-neutral/80 active:bg-neutral/80 focus:bg-neutral sm:hover:text-white focus:text-white active:text-white "}`} key={index} href={!isAdmin && searchTerm && !sortTerm? `/search/${searchTerm}/page/${pg+1}` : isAdmin ? `/admin/products/page/${pg + 1}` : `/products/sort/${sortTerm}/select/${categoryTerm}/page/${pg+1}`}>
                           {pg + 1}
                       </Link>
                    )
                })
       )
    );
};

export default Paginate;