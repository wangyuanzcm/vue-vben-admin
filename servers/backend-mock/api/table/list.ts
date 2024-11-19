import { faker } from '@faker-js/faker';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

function generateMockDataList(count: number) {
  const dataList = [];

  for (let i = 0; i < count; i++) {
    const dataItem = {
      available: faker.datatype.boolean(),
      category: faker.commerce.department(),
      color: faker.color.human(),
      currency: faker.finance.currencyCode(),
      description: faker.commerce.productDescription(),
      id: faker.string.uuid(),
      imageUrl: faker.image.avatar(),
      imageUrl2: faker.image.avatar(),
      inProduction: faker.datatype.boolean(),
      open: faker.datatype.boolean(),
      price: faker.commerce.price(),
      productName: faker.commerce.productName(),
      quantity: faker.number.int({ max: 100, min: 1 }),
      rating: faker.number.float({ max: 5, min: 1 }),
      releaseDate: faker.date.past(),
      status: faker.helpers.arrayElement(['success', 'error', 'warning']),
      tags: Array.from({ length: 3 }, () => faker.commerce.productAdjective()),
      weight: faker.number.float({ max: 10, min: 0.1 }),
    };

    dataList.push(dataItem);
  }

  return dataList;
}

const mockData = generateMockDataList(100);

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  await sleep(600);

  const { page, pageSize } = getQuery(event);
  return usePageResponseSuccess(page as string, pageSize as string, mockData);
});
