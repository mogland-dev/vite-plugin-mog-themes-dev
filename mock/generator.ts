import http from "http";
import { faker } from "@faker-js/faker";
import {
  Category,
  IRenderPage,
  Post,
  Render,
  RenderArchivePage,
  RenderCategoryPage,
  RenderFriendsPage,
  RenderIndexPage,
  RenderTagPage,
  RenderType,
} from "../@types";
import { mock } from "./data";

function generateIndexPaginate() {
  const data = mock.site.posts;
  const totalDocs = data.length;
  const limit = faker.number.int({ min: 10, max: 20 });
  const totalPages = Math.ceil(totalDocs / limit);
  const page = faker.number.int({ min: 1, max: totalPages });
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;
  const prevPage = hasPrevPage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;
  return {
    docs: data,
    totalDocs,
    limit,
    totalPages,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  };
}

function generateCategoryOrTagPage(
  data: Category | string,
  post: Post[],
  type: RenderType
) {
  let _data: Record<string, any> = {};
  if (typeof data === "string") {
    _data = {
      name: data,
    };
  } else {
    _data = data;
  }
  return {
    data: {
      ..._data,
      children: post,
    },
    isTag: type === "tag",
    isCategory: type === "category",
  } as RenderCategoryPage | RenderTagPage;
}

function generatePageVariable<T extends RenderType>({
  type,
}: {
  type: T;
}): IRenderPage<T> {
  const posts = mock.site.posts;
  const pages = mock.site.pages;
  switch (type) {
    case "index":
      return generateIndexPaginate() as RenderIndexPage as IRenderPage<T>;
    case "category":
      return generateCategoryOrTagPage(
        mock.site.categories[faker.number.int({ min: 0, max: 6 })],
        posts,
        type
      ) as RenderCategoryPage as IRenderPage<T>;
    case "tag":
      return generateCategoryOrTagPage(
        mock.site.tags[faker.number.int({ min: 0, max: 6 })].name,
        posts,
        type
      ) as RenderTagPage as IRenderPage<T>;
    case "archive":
      return {
        data: {
          children: posts,
        },
        isCategory: false,
      } as RenderArchivePage as IRenderPage<T>;
    case "friends":
      return mock.friends as RenderFriendsPage as IRenderPage<T>;
    case "posts":
      return posts[
        faker.number.int({ min: 0, max: posts.length - 1 })
      ] as IRenderPage<T>;
    case "pages":
      return mock.site.pages[
        faker.number.int({ min: 0, max: pages.length - 1 })
      ] as IRenderPage<T>;
    default:
      throw new Error("Unknown type");
  }
}

export function generateMockData<T extends RenderType>(
  req: http.IncomingMessage & {
    query: Record<string, string>;
    params: string[];
  }
): Render<T> {
  if (!req) {
    throw new Error("Why req is undefined?");
  }
  const _type = req.url!.split("/").slice(1)[0];
  const validTypes = [
    "index",
    "category",
    "tag",
    "archive",
    "friends",
    "post",
    "page",
  ];

  let type: RenderType;

  if (_type && validTypes.includes(_type)) {
    type = _type as RenderType;
  } else if (req.params.length === 0) {
    type = "archive";
  } else {
    type = "index";
  }
  const path = req.url!;
  return {
    page: generatePageVariable({
      type,
    }) as IRenderPage<T>,
    site: {
      ...mock.site,
    },
    config: mock.config,
    theme: mock.theme,
    path,
    url: {
      url: `${req.headers.host}${req.url}`,
      path,
      query: req.query || {},
      params: req.params.reduce((prev, curr, index) => {
        prev[index] = curr;
        return prev;
      }, {} as Record<string, string>),
      host: req.headers.host || "",
      protocol: req.headers["x-forwarded-proto"]?.toString() || "http",
      origin: `${req.headers["x-forwarded-proto"]?.toString() || "http"}://${
        req.headers.host
      }${req.url}`,
    },
    user: mock.user,
  };
}

module.exports = {
  generateMockData,
};
