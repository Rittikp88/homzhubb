import axios from 'axios';

const ENDPOINTS = {
  baseUrl: 'https://api-ap-northeast-1.graphcms.com/v2/ckiqymr7djhfb01z1di6m4fjs/master',
};

export interface IFeaturedProperties {
  address: string;
  category: string;
  coverImage: { url: string };
  developer: { name: string };
  featured: boolean;
  id: string;
  images: { url: string }[];
  possessionDate: string;
  priceRange: string;
  projectName: string;
  slug: string;
  stage: string;
  typesAvailable: string;
}

const Queries = {
  featuredProperties: `query {
        properties(orderBy: updatedAt_ASC) {
            id
            address
            possessionDate
            category
            priceRange
            typesAvailable
            coverImage {
                url
            }
            developer {
                name
            }
            projectName
            slug
            stage
            featured
            images {
                url
            }
        }
    }`,
};
class GraphQLRepository {
  public getFeaturedProperties = async (): Promise<IFeaturedProperties[]> => {
    const { featuredProperties } = Queries;
    const response = await axios({
      url: ENDPOINTS.baseUrl,
      method: 'post',
      data: {
        query: featuredProperties,
      },
    }).then((result) => {
      return result.data;
    });
    return response.data.properties;
  };
}

const graphQLRepository = new GraphQLRepository();
export { graphQLRepository as GraphQLRepository };
