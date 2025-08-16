import prisma from '@/lib/db';

export interface CmsLayoutInput {
  name: string;
  slug: string;
  device?: 'mobile' | 'desktop' | 'responsive';
  data: unknown;
  published?: boolean;
}

export const CmsLayoutsService = {
  async list() {
    return prisma.cmsLayout.findMany({ orderBy: { updatedAt: 'desc' } });
  },

  async getBySlug(slug: string) {
    return prisma.cmsLayout.findUnique({ where: { slug } });
  },

  async getById(id: number) {
    return prisma.cmsLayout.findUnique({ where: { id } });
  },

  async create(input: CmsLayoutInput) {
    return prisma.cmsLayout.create({
      data: {
        name: input.name,
        slug: input.slug,
        device: input.device ?? 'responsive',
        data: input.data as any,
        published: input.published ?? false,
      },
    });
  },

  async update(id: number, input: Partial<CmsLayoutInput>) {
    return prisma.cmsLayout.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.device !== undefined ? { device: input.device } : {}),
        ...(input.data !== undefined ? { data: input.data as any } : {}),
        ...(input.published !== undefined ? { published: input.published } : {}),
      },
    });
  },

  async remove(id: number) {
    return prisma.cmsLayout.delete({ where: { id } });
  },
};


