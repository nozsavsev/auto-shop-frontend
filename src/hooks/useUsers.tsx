import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { API, ResponseWrapper } from "../API";
import { AllUsersDTO, CreateUpdateUserDTO } from "../API/AutoShopApi/models";
import { ApiUsersIdPutRequest } from "../API/AutoShopApi";

export function useUsers(initialPage: number = 0, initialPageSize: number = 10, textMatch: string | undefined = undefined, initialData: ResponseWrapper<AllUsersDTO> | undefined = undefined) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { data, error, isLoading, mutate } = useSWR<ResponseWrapper<AllUsersDTO>>(
    [page, pageSize, textMatch],
    async () => await API.Client.Users.SearchUsers({ skip: page * pageSize, take: pageSize, textMatch: textMatch }),
    {
      fallbackData: initialData,
      revalidateOnFocus: true,
      revalidateOnMount: false,
      revalidateOnReconnect: true,
      dedupingInterval: 1000 * 5,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );
  
  useEffect(() => {
    mutate();
  }, [textMatch]);

  const updateUser = async (userId: number, updatedUser: CreateUpdateUserDTO) => {
    const response = await API.Client.Users.UpdateUser({ id: userId, createUpdateUserDTO: updatedUser });

    if (!response.error && response.data) {
      await mutate(
        (currentData) => {
          if (!currentData?.data?.users) return currentData;

          const updatedUsers = currentData.data.users.map((user) => (user.id === userId ? response.data : user));

          return {
            ...currentData,
            data: {
              ...currentData.data,
              users: updatedUsers,
            },
          } as ResponseWrapper<AllUsersDTO>;
        },
        { revalidate: false }
      );
    }

    return response;
  };

  const deleteUser = async (userId: number) => {
    const response = await API.Client.Users.DeleteUser({ id: userId });

    if (!response.error) {
      await mutate(
        (currentData) => {
          if (!currentData?.data?.users) return currentData;
          const updatedUsers = currentData.data.users.filter((user) => user.id !== userId);

          return {
            ...currentData,
            data: {
              ...currentData.data,
              users: updatedUsers,
              totalCount: (currentData.data.totalCount ?? 1) - 1,
            },
          } as ResponseWrapper<AllUsersDTO>;
        },
        { revalidate: true }
      );
    }

    return response;
  };

  const totalCount = data?.data?.totalCount ?? 0;
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  return {
    users: data?.data?.users ?? [],
    isLoading,
    error: error || data?.error,
    apiError: data?.error,
    refresh: mutate,
    updateUser,
    deleteUser,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
      setPage: setPage,
      setPageSize: setPageSize,
    },
  };
}
