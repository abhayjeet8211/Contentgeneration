import { prisma } from '../../db/prisma';

export interface DuplicateDetectionOptions {
  contentHash: string;
  userId?: string;
  projectId?: string;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  isSameProject: boolean;
  existingSourceId?: string;
  existingSourceTitle?: string;
  message?: string;
}

export class DuplicateDetector {
  public static async checkDuplicate(
    options: DuplicateDetectionOptions
  ): Promise<DuplicateDetectionResult> {
    const { contentHash, userId, projectId } = options;

    if (!contentHash) {
      return { isDuplicate: false, isSameProject: false };
    }

    try {
      // Find matching sources where contentHash equals this hash
      // Note: we only query for sources belonging to projects owned by the requesting user
      if (!userId) {
        return { isDuplicate: false, isSameProject: false };
      }

      // Query database for this user's sources with the same contentHash
      const matchingSource = await prisma.source.findFirst({
        where: {
          contentHash,
          project: {
            userId,
          },
        },
        select: {
          id: true,
          title: true,
          projectId: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!matchingSource) {
        // Either not found or uploaded by another user.
        // If uploaded by another user, strict privacy boundary: do not leak!
        return { isDuplicate: false, isSameProject: false };
      }

      const isSameProject = Boolean(projectId && matchingSource.projectId === projectId);

      if (isSameProject) {
        return {
          isDuplicate: true,
          isSameProject: true,
          existingSourceId: matchingSource.id,
          existingSourceTitle: matchingSource.title,
          message: 'Duplicate content detected. This exact source already exists in this project.',
        };
      }

      return {
        isDuplicate: true,
        isSameProject: false,
        existingSourceId: matchingSource.id,
        existingSourceTitle: matchingSource.title,
        message: 'Duplicate content detected in another project in your account.',
      };
    } catch (err) {
      console.warn('Duplicate detection check failed gracefully:', err);
      return { isDuplicate: false, isSameProject: false };
    }
  }
}
