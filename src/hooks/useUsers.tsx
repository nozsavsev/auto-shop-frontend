import useSWR from "swr";
import UsersAPI from "../Users";
import React, { useState } from "react";
import { ResponseWrapper, AllUsersDTO, UserDTO, createUpdateUserDTO } from "../types";

export function useUsers() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, error, isLoading, mutate } = useSWR<ResponseWrapper<AllUsersDTO>>(
    ["/api/users", page, pageSize],
    () => UsersAPI.getAllUsers(page * pageSize, pageSize),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000 * 5,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );

  const updateUser = async (userId: number, updatedUser: createUpdateUserDTO) => {
    const response = await UsersAPI.updateUser(userId, updatedUser);

    if (!response.error && response.data) {
      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;
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
    const response = await UsersAPI.deleteUser(userId);

    if (!response.error) {
      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;
          const updatedUsers = currentData.data.users.filter((user) => user.id !== userId);

          return {
            ...currentData,
            data: {
              ...currentData.data,
              users: updatedUsers,
              totalCount: currentData.data.totalCount - 1,
            },
          } as ResponseWrapper<AllUsersDTO>;
        },
        { revalidate: true }
      );
    }

    return response;
  };

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
      totalUsers: data?.data?.totalCount,
      totalPages: data?.data?.totalCount ? Math.ceil(data?.data?.totalCount / pageSize) : 0,
      hasNextPage: page < (data?.data?.totalCount ? Math.ceil(data?.data?.totalCount / pageSize) : 0) - 1,
      hasPrevPage: page > 0,
      setPage: setPage,
      setPageSize: setPageSize,
    },
  };
}
